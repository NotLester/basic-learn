"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export function DeletePostBtn({ id }: { id: number }) {
  const { toast } = useToast();
  const router = useRouter();

  const deletePost = api.post.removePostById.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Post deleted",
        description: "The post has been deleted",
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      onClick={() => deletePost.mutate({ id })}
      disabled={deletePost.isPending}
      variant="destructive"
      className="border-2 border-solid p-2 shadow-inner"
    >
      {deletePost.isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
