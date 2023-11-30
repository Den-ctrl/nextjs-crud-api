"use client";

import React, { FormEvent } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { InputType } from "../../../page.types";

function LoginUI() {
  const { register } = useForm();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: InputType = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await axios.post("https://reqres.in/api/login", data);
      const { token } = response.data;

      if (response) {
        console.log(token);
        localStorage.setItem("token", token);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid
      container
      sx={{
        height: "90vh",
        margin: "20px",
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12} sm={6}>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          CRUD
        </Typography>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          CREATE, READ, UPDATE, DELETE
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Card sx={{ maxWidth: 400, padding: 3, textAlign: "center" }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                {...register("email")}
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                {...register("password")}
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
              />
              <Button
                variant="contained"
                type="submit"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Log In
              </Button>

              <Typography m={2}>
                <Link href="#">Forgot your password?</Link>
              </Typography>
              <Divider />
              <Button
                color="success"
                variant="contained"
                sx={{ marginTop: 2, width: 0.65 }}
              >
                Create New Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default LoginUI;
