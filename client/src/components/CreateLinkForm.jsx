import { useEffect, useMemo, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useUserState } from "@/context/userContext";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(50),
  longUrl: z.string().url("Enter a valid URL"),
  customUrl: z.string().optional(),
});

export function CreateLinkForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(!!searchParams.get("link"));
  const qrContainerRef = useRef(null);
  const qrRef = useRef(null);
  const { refreshLinks } = useUserState();

  const link = searchParams.get("link");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      longUrl: link || "",
      customUrl: "",
    },
  });

  useEffect(() => {
    if (link) {
      form.setValue("longUrl", link);
    }
  }, [link, form]);

  const qrCode = useMemo(() => {
    if (!form.watch("longUrl")) return null;
    return <QRCode size={200} value={form.watch("longUrl")} ref={qrRef} />;
  }, [form.watch("longUrl")]);

  const getQRCodeBlob = () => {
    return new Promise((resolve, reject) => {
      if (!qrContainerRef.current) return reject("QR code container not found");

      const canvas = qrContainerRef.current.querySelector("canvas");
      if (!canvas) return reject("QR code canvas not found");

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject("Failed to generate QR code image");
      }, "image/png");
    });
  };

  async function onSubmit(values) {
    try {
      setIsSubmitting(true);
      const qrBlob = await getQRCodeBlob();
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/urls/createUrl",
        {
          title: values.title,
          longUrl: values.longUrl,
          customUrl: values.customUrl,
          qrBlob: qrBlob,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Response:", response);
      setOpen(false);
      setSearchParams({});
      form.reset();
      refreshLinks();
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(res) => {
        setOpen(res);
        if (!res) {
          setSearchParams({});
          form.reset();
        }
      }}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">
          Create New Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-black/5 via-blue-800/20 to-blue-950 border border-white/3">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm -z-10"></div>
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl text-white">
            Create New Link
          </DialogTitle>
        </DialogHeader>

        <div
          className="flex justify-center p-4 bg-white/5 rounded-lg"
          ref={qrContainerRef}>
          {qrCode}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col items-center w-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Short Link's Title"
                      {...field}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Enter long URL"
                      {...field}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customUrl"
              render={({ field }) => (
                <FormItem className="w-full flex gap-2">
                  <div className="px-3 py-2 bg-white/5 rounded-md text-sm text-white/70">
                    trimrr.in/
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Custom Link (optional)"
                      {...field}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
