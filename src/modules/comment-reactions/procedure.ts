import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const commentReactionsRouter = createTRPCRouter({
    like: protectedProcedure
        .input(z.object({ commentId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { commentId } = input;
            const { id : userId } = ctx.user;

            const [ existingCommentReactionsLike ] = await db
                .select()
                .from(commentReactions)
                .where(and(
                    eq(commentReactions.commentId, commentId),
                    eq(commentReactions.userId, userId),
                    eq(commentReactions.type, "like")
                ));
            
                // 이미 좋아요를 눌러 둔 경우 이를 삭제함 //
            if ( existingCommentReactionsLike ) {
                const [ deletedViewerReaction ] = await db
                    .delete(commentReactions)
                    .where(
                        and(
                            eq(commentReactions.userId, userId),
                            eq(commentReactions.commentId, commentId),
                        )
                    )
                    .returning();
                
                return deletedViewerReaction;
            }
                // 아니라면 좋아요를 눌러 둔 비디오 리액션을 추가함 //
                // onConflictDoUpdate는 이미 dislike일 때 like를 누르고자 하면 //
                // userId와 videoId의 조합만을 가지고 type만 업데이트 하라 라는 뜻임 //
            const [ createdCommentReaction ] = await db
                .insert(commentReactions)
                .values({ userId, commentId, type: "like" })
                .onConflictDoUpdate({
                    target: [commentReactions.userId, commentReactions.commentId],
                    set: {
                        type: "like",
                    }
                })
                .returning();
            
            return createdCommentReaction;
        }),
    dislike: protectedProcedure
        .input(z.object({ commentId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { commentId } = input;
            const { id : userId } = ctx.user;

            const [ existingCommentReactionDislike ] = await db
                .select()
                .from(commentReactions)
                .where(and(
                    eq(commentReactions.commentId, commentId),
                    eq(commentReactions.userId, userId),
                    eq(commentReactions.type, "dislike")
                ));
            
                // 이미 좋아요를 눌러 둔 경우 이를 삭제함 //
            if ( existingCommentReactionDislike ) {
                const [ deletedCommentReactionDislike ] = await db
                    .delete(commentReactions)
                    .where(
                        and(
                            eq(commentReactions.userId, userId),
                            eq(commentReactions.commentId, commentId),
                        )
                    )
                    .returning();
                
                return deletedCommentReactionDislike;
            }
                // 아니라면 좋아요를 눌러 둔 비디오 리액션을 추가함 //
                // onConflictDoUpdate는 이미 like일 때 dislike를 누르고자 하면 //
                // userId와 videoId의 조합만을 가지고 type만 업데이트 하라 라는 뜻임 //
            const [ createdVideoReactionDislike ] = await db
                .insert(commentReactions)
                .values({ userId, commentId, type: "dislike" })
                .onConflictDoUpdate({
                    target: [commentReactions.userId, commentReactions.commentId],
                    set: {
                        type: "dislike",
                    }
                })
                .returning();
            
            return createdVideoReactionDislike;
        })
})