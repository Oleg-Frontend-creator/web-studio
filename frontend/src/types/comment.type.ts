import {UserInfoType} from "./user-info.type";
import {CommentVoteType} from "./comment-vote.type";

export type CommentType = {
  id: string,
  text: string,
  date: Date,
  likesCount: number,
  dislikesCount: number,
  user: UserInfoType,
  currentUserCommentViolation?: boolean,   //если текущий залогиненный пользователь жалуется на коммент, то здесь будет true
  currentUserVote?: CommentVoteType        //голос текущего пользователя для коммента - лайк, дизлайк или ничего
}
