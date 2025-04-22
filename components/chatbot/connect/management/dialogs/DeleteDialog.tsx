import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

interface DeleteDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isDeleting: boolean;
    onDelete: () => void;
}

const DeleteDialog = ({ isOpen, setIsOpen, isDeleting, onDelete }: DeleteDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete WhatsApp Number</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this WhatsApp Number?.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting" : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteDialog;
