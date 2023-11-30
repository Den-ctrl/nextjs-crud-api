import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { PostDataType, CommentType, UserType } from "../../../page.types";

export function PageTopNav() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Button color="inherit" size="large" onClick={() => router.push("/")}>
          CRUD
        </Button>

        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <Avatar alt="Profile" />
        </IconButton>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export function PageContent() {
  const [postData, setPostData] = React.useState<PostDataType[]>([]);
  const [commentsData, setCommentsData] = React.useState<CommentType[]>([]);
  const [userData, setUserData] = React.useState<UserType[]>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    axios
      .get<PostDataType[]>("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        setPostData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });

    axios
      .get<UserType[]>("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleCommentsClick = (postId: number) => {
    axios
      .get<CommentType[]>(
        `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
      )
      .then((response) => {
        setCommentsData(response.data);
        setOpenModal(true);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  };

  const getUserNameById = (userId: number): string => {
    const user = userData.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Grid m={10}>
      {postData.map((post, index) => (
        <Card key={post.id} sx={{ marginBottom: 2, borderRadius: "8px" }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ marginRight: 1 }} />

              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {getUserNameById((index % userData.length) + 1)}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.body}
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => {
                  handleCommentsClick(post.id);
                }}
              >
                Comments
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          {commentsData.map((comment) => (
            <div key={comment.id}>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs>
                  <Link href={`/${comment.id}`}>
                    <Typography
                      variant="subtitle1"
                      style={{ fontWeight: "bold" }}
                    >
                      {comment.name}
                    </Typography>
                  </Link>
                  <Typography variant="body2" color="textSecondary">
                    {comment.email}
                  </Typography>
                  <DialogContentText>{comment.body}</DialogContentText>
                </Grid>
              </Grid>
              <Divider variant="middle" />
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
