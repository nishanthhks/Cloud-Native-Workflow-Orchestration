import { useNavigate } from "react-router-dom";
import { Copy, Trash2 } from "lucide-react";
import { QRCode } from "react-qrcode-logo";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import axios from "axios";
import { useUserState } from "@/context/userContext";

function LinkCard({ qr, title, longUrl, ShortUrl, CustomeUrl, _id }) {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { refreshLinks } = useUserState();

  const handleAnalyze = () => {
    navigate(`/analytics/${_id}`);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/urls/deleteUrl/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshLinks();
    } catch (error) {
      console.error("Error deleting link:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="border border-blue-500/10 sm:flex gap-2 p-2 rounded-lg text-white relative overflow-hidden">
      {/* Gradient Background with Wheel */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-800/5 to-blue-950/5">
        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-gradient-to-tr from-blue-600/40 to-blue-800/40 rounded-full blur-xl animate-spin-slow"></div>
      </div>

      {/* QR Code & Analyze Button */}
      <div className="flex flex-col items-center justify-center p-2 bg-blue-900/20 rounded-md relative z-10 backdrop-blur-sm">
        <div>
          <QRCode
            value={longUrl}
            size={100}
            className="border border-blue-700"
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleAnalyze}
            className="px-2 py-1 text-sm bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors">
            Analyze
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="px-2 py-1 text-sm bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-1">
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* URL Information */}
      <div className="w-full flex flex-col justify-center p-3 bg-black/25 rounded-md relative z-10 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-white">{title}</h2>

        <div className="flex items-center gap-2 group">
          <button onClick={() => handleCopy(longUrl)}>
            <Copy className="h-4 w-4 text-blue-300" />
          </button>
          <p className="text-sm text-blue-200 truncate flex-1">
            Long: {longUrl}
          </p>
        </div>

        <div className="flex items-center gap-2 group">
          <button onClick={() => handleCopy(ShortUrl)}>
            <Copy className="h-4 w-4 text-blue-300" />
          </button>
          <p className="text-sm text-blue-200 truncate flex-1">
            Short: {ShortUrl}
          </p>
        </div>

        <div className="flex items-center gap-2 group">
          <button onClick={() => handleCopy(CustomeUrl)}>
            <Copy className="h-4 w-4 text-blue-300" />
          </button>
          <p className="text-sm text-blue-200 truncate flex-1">
            Custom: {CustomeUrl}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gradient-to-br from-black/5 via-blue-800/20 to-blue-950 border border-white/3">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Link
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete this link? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-800 to-red-950 hover:from-red-700 hover:to-red-900 text-white">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default LinkCard;
