import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { useUser, useClerk } from "@clerk/nextjs";
import { z } from "zod";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { commentInsertSchema } from "@/db/schema";
import { Form, FormField, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface CommentFormProps {
    videoId: string;
    parentId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    variant?: "comment" | "reply";
};

export const CommentForm = ({
    videoId,
    parentId,
    onSuccess,
    onCancel,
    variant = "comment"
} : CommentFormProps) => {

    const { user } = useUser();
    
    const clerk = useClerk();
    const utils = trpc.useUtils();
    const create = trpc.comments.create.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId });
            utils.comments.getMany.invalidate({ videoId, parentId });
            form.reset();
            toast.success("Comment Added");
            onSuccess?.();
        },
        onError: (error) => {
            toast.error("Something went wrong");

            if(error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    });

    const commentFormSchema = commentInsertSchema.omit({ userId: true });
    type CommentFormValues = z.infer<typeof commentFormSchema>

    const form = useForm<CommentFormValues>({
        resolver: zodResolver(commentFormSchema),
        defaultValues: {
            parentId: parentId,
            videoId: videoId,
            value: "",
        }
    });

    const handleSubmit = ( values : CommentFormValues ) => {
        create.mutate(values);
    }

    const handleCancel = () => {
        form.reset();
        onCancel?.();
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex gap-4 group"
            >
                <UserAvatar
                    size="lg"
                    imageUrl={user?.imageUrl || "/user-placeholder.svg"}
                    name={user?.username || "User"}
                />
                <div className="flex-1">
                    <FormField
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder={
                                            variant === "comment"?
                                            "Add a comment...." :
                                            "Reply to this comment"
                                        }
                                        className="resize-none bg-transparent overflow-hidden min-h-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                    />
                    
                    <div className="justify-end gap-2 mt-2 flex">
                        {
                            onCancel && (
                                <Button variant="ghost"  type="button" onClick={handleCancel}>
                                    cancel
                                </Button>
                            )
                        }
                        <Button
                            disabled={create.isPending}
                            type="submit"
                            size="sm"
                        >
                            {variant === "comment"? "Comment" : "Reply"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
        
    )

}