"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { PageTopNav } from "../components/mainContentUi";
import { loginValidation } from "../page";
import { TodoType, CommentType } from "../../../page.types";
import { useForm } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  Avatar,
  Button,
  Container,
  TextField,
  Grid,
  Paper,
  Typography,
  Divider,
  Switch,
} from "@mui/material";

export default function Profile() {
  const router = usePathname();
  const userId = router.split("/");
  const numericUserId = parseInt(userId[1], 10);

  const [userData, setUserData] = useState<CommentType>();
  const [todo, setTodo] = useState<TodoType[]>([]);
  const { register, reset, getValues } = useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [switchStatus, setSwitchStatus] = useState<boolean>(false);

  loginValidation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get<CommentType>(
          `https://jsonplaceholder.typicode.com/comments/${numericUserId}`
        );
        setUserData(userResponse.data);

        const todoResponse = await axios.get(
          "https://jsonplaceholder.typicode.com/todos"
        );
        setTodo(todoResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [numericUserId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: TodoType = {
      userId: 1 as number,
      id: (todo.length + 1) as number,
      title: formData.get("todoData") as string,
      completed: false as boolean,
    };

    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/todos",
        data
      );

      if (response) {
        const newData = response.data;
        setTodo([...todo, newData]);
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (todoId: number) => {
    try {
      const response = await axios.delete(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`
      );

      const updatedData = todo.filter((item) => item.id !== todoId);
      setTodo(updatedData);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleEdit = (todoId: number, completed: boolean) => {
    setEditingId(todoId);
    setSwitchStatus(completed);
  };

  const handleSaveEdit = async (todoId: number, editedTodo: string) => {
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        { title: editedTodo, completed: switchStatus }
      );

      setTodo((prevTodo) =>
        prevTodo.map((item) =>
          item.id === todoId
            ? { ...item, title: editedTodo, completed: switchStatus }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating data:", error);
    }

    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  if (userData)
    return (
      <Container
        sx={{ display: "flex", flexDirection: "column", marginTop: 2 }}
      >
        <PageTopNav />

        <Grid container spacing={3} sx={{ flex: 1 }}>
          <Grid item xs={12} md={4} marginTop={10}>
            <Paper
              elevation={3}
              style={{ padding: 16, textAlign: "center", height: "100%" }}
            >
              <Avatar
                alt="User Avatar"
                sx={{ width: 100, height: 100, margin: "auto" }}
              />
              <Typography variant="h5" gutterBottom>
                {userData?.name}
              </Typography>
              <Typography color="textSecondary">{userData?.email}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8} marginTop={10}>
            <Paper elevation={3} style={{ padding: 16, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                About Me
              </Typography>
              <Typography paragraph sx={{ height: "100%" }}>
                {userData?.body}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ marginTop: 5 }}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography
                variant="h3"
                gutterBottom
                textAlign="center"
                style={{ marginBottom: "16px" }}
              >
                To-Do List
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  {...register("todoData")}
                  label="Add To-do"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  style={{ marginBottom: "16px" }}
                />
                <Divider sx={{ margin: "16px 0" }} />
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={2} marginTop={1}>
          {todo
            .slice()
            .reverse()
            .map((todo) => (
              <Grid key={todo.id} item xs={12} sm={6} md={4}>
                <Paper
                  style={{
                    position: "relative",
                    padding: "20px",
                    textAlign: "center",
                    height: 200,
                  }}
                >
                  <Typography paragraph align="left">
                    {todo.id}
                  </Typography>
                  {editingId === todo.id ? (
                    <>
                      <TextField
                        {...register("editedTodo")}
                        defaultValue={todo.title}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        style={{ marginBottom: "16px" }}
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={switchStatus}
                            onChange={() => setSwitchStatus(!switchStatus)}
                            color="primary"
                          />
                        }
                        label={switchStatus ? "Completed" : "Incomplete"}
                        style={{ marginBottom: "16px" }}
                      />
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" gutterBottom>
                        {todo.title}
                      </Typography>
                      <Typography paragraph>{`Status: ${
                        todo.completed ? "Completed" : "Incomplete"
                      }`}</Typography>
                    </>
                  )}

                  {editingId === todo.id ? (
                    <>
                      <Button
                        onClick={() =>
                          handleSaveEdit(todo.id, getValues("editedTodo"))
                        }
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "50%",
                        }}
                        color="primary"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "50%",
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleEdit(todo.id, todo.completed)}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "50%",
                        }}
                        color="primary"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(todo.id)}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "50%",
                        }}
                        color="error"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Container>
    );
}
