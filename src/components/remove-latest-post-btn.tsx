"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export function RemoveLatestPostBtn() {
  const router = useRouter();
  const { toast } = useToast();

  const removeLatestPost = api.post.removeLatestPost.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        variant: "destructive",
        title: "Latest post removed",
        description: "The latest post has been removed",
      });
    },
  });

  return (
    <Button
      variant="secondary"
      className="border-2 border-solid p-2 shadow-inner"
      onClick={() => removeLatestPost.mutate()}
      disabled={removeLatestPost.isPending}
    >
      {removeLatestPost.isPending ? "Removing..." : "Remove latest post"}
    </Button>
  );
}
