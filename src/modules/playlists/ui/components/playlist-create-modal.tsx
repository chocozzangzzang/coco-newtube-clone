import { trpc } from "@/trpc/client";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { ResponsiveModal } from "@/modules/studio/ui/components/responsive-dialog";

interface PlaylistCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    name: z.string().min(1),
})

export const PlaylistCreateModal = ({
    open,
    onOpenChange
}:PlaylistCreateModalProps) => {

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        create.mutate(values);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    })

    const onUploadComplete = () => {
        onOpenChange(false);
    }
    const utils = trpc.useUtils();
    const create = trpc.playlists.create.useMutation({
        onSuccess: () => {
            toast.success("Playlist created!!");
            form.reset();
            onOpenChange(false);
            utils.playlists.getMany.invalidate();
            },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    return (
        <ResponsiveModal
            title="Create a playlist"
            open={open}
            onOpenChange={onOpenChange}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="My favorite videos"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={create.isPending}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveModal>
    )
}