import "./CommentsList.css"
import { useEffect, useState } from "react";
import axios from "axios";

const CommentsList = (props) => {
    const { processId } = props;
    const [commentList, setCommentList] = useState([]);

    const fetchData = async (userId) => {
        try {
            const response = await axios.get(`https://localhost:44367/Photo/GetPhoto/${userId}?type=user`, {
                responseType: 'arraybuffer',
            });

            if (response.status === 200) {
                const base64String = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ''
                    )
                );

                return `data:image/jpeg;base64,${base64String}`;
            } else {
                // Обработка ошибки
                return null;
            }
        } catch (error) {
            // Обработка ошибки
            console.error(error);
            return null;
        }
    };

    useEffect(() => {
        const fetchExpertViews = async () => {
            try {
                const response = await axios.get("https://localhost:44367/User/GetCommentsByProcessId?processId=" + processId);
                const comments = response.data.data;

                const commentsWithImages = await Promise.all(
                    comments.map(async (comment) => {
                        const photoUrl = await fetchData(comment.user.id);
                        return { ...comment, photoUrl };
                    })
                );

                setCommentList(commentsWithImages);
            } catch (error) {
                console.error(error.response.data.message);
            }
        };

        fetchExpertViews();
    }, [processId]);

    return <div className="mainListBlock">
        {
            commentList.map((comment) => (
                <div className="listItem" key={comment.id}>
                    <div className="icon">
                        <svg width="100%" height="100%" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">
                            <clipPath id="circleClip">
                                <circle cx="0.5" cy="0.5" r="0.5" />
                            </clipPath>
                            <image x="0" y="0" width="100%" height="100%" href={comment.photoUrl} clipPath="url(#circleClip)" alt="Иконка профиля" />
                        </svg>
                    </div>
                    <div className="userInfo" key={comment.user.id}>

                        <p className="textOfComment">
                            {comment.user.login}
                        </p>
                        
                    </div>
                    <div className="commentInfo" key={comment.user.login}>
                        <p className="textOfComment">{comment.commentText}</p>
                    </div>
                </div>
            ))
        }

    </div>


}

export default CommentsList;