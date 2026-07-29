import { getComments } from "@/app/(publicGroup)/_actions/commentActions";
import { getMe } from "@/service/getMe";
import { CommentList } from "./CommentList";

type CommentSectionProps = {
  postId: string;
};

export async function CommentSection({ postId }: CommentSectionProps) {
  const [commentsResult, userResult] = await Promise.all([
    getComments(postId),
    getMe(),
  ]);

  const comments = commentsResult.success ? commentsResult.data : [];

  const currentUserId = userResult.success
    ? userResult.data.profile.id
    : null;
  const currentUserRole = userResult.success
    ? userResult.data.profile.role
    : null;
  const isLoggedIn = userResult.success;

  return (
    <CommentList
      postId={postId}
      initialComments={comments}
      commentCount={comments.length}
      currentUserId={currentUserId}
      currentUserRole={currentUserRole}
      isLoggedIn={isLoggedIn}
    />
  );
}
