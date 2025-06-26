import { db } from "@/db";
import { videoReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videoReactionsRouter = createTRPCRouter({
    like: protectedProcedure
        .input(z.object({ videoId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { videoId } = input;
            const { id : userId } = ctx.user;

            const [ existingVideoReaction ] = await db
                .select()
                .from(videoReactions)
                .where(and(
                    eq(videoReactions.videoId, videoId),
                    eq(videoReactions.userId, userId),
                    eq(videoReactions.type, "like")
                ));
            
                // 이미 좋아요를 눌러 둔 경우 이를 삭제함 //
            if ( existingVideoReaction ) {
                const [ deletedViewerReaction ] = await db
                    .delete(videoReactions)
                    .where(
                        and(
                            eq(videoReactions.userId, userId),
                            eq(videoReactions.videoId, videoId),
                        )
                    )
                    .returning();
                
                return deletedViewerReaction;
            }
                // 아니라면 좋아요를 눌러 둔 비디오 리액션을 추가함 //
                // onConflictDoUpdate는 이미 dislike일 때 like를 누르고자 하면 //
                // userId와 videoId의 조합만을 가지고 type만 업데이트 하라 라는 뜻임 //
            const [ createdVideoReaction ] = await db
                .insert(videoReactions)
                .values({ userId, videoId, type: "like" })
                .onConflictDoUpdate({
                    target: [videoReactions.userId, videoReactions.videoId],
                    set: {
                        type: "like",
                    }
                })
                .returning();
            
            return createdVideoReaction;
        }),
    dislike: protectedProcedure
        .input(z.object({ videoId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { videoId } = input;
            const { id : userId } = ctx.user;

            const [ existingVideoReactionDislike ] = await db
                .select()
                .from(videoReactions)
                .where(and(
                    eq(videoReactions.videoId, videoId),
                    eq(videoReactions.userId, userId),
                    eq(videoReactions.type, "dislike")
                ));
            
                // 이미 좋아요를 눌러 둔 경우 이를 삭제함 //
            if ( existingVideoReactionDislike ) {
                const [ deletedViewerReactionDislike ] = await db
                    .delete(videoReactions)
                    .where(
                        and(
                            eq(videoReactions.userId, userId),
                            eq(videoReactions.videoId, videoId),
                        )
                    )
                    .returning();
                
                return deletedViewerReactionDislike;
            }
                // 아니라면 좋아요를 눌러 둔 비디오 리액션을 추가함 //
                // onConflictDoUpdate는 이미 like일 때 dislike를 누르고자 하면 //
                // userId와 videoId의 조합만을 가지고 type만 업데이트 하라 라는 뜻임 //
            const [ createdVideoReactionDislike ] = await db
                .insert(videoReactions)
                .values({ userId, videoId, type: "dislike" })
                .onConflictDoUpdate({
                    target: [videoReactions.userId, videoReactions.videoId],
                    set: {
                        type: "dislike",
                    }
                })
                .returning();
            
            return createdVideoReactionDislike;
        })
})