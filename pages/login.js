import { useContext, useEffect, useState } from 'react';
import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from '@/styles/member/mem-login.module.css';
import Image from 'next/image';
// import MemMuiSwitch from '@/components/common/member/mem-muiSwitch';
import BlankLayout from '@/components/layout/blank-layout';
// import MemBtn from '@/components/common/member/mem-Btn';
import MemLoginBtn from '@/components/member/mem-loginBtn';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import AuthContext from '@/context/AuthContext';
import GoogleLogo from '@/components/icons/google-logo';
import axios from 'axios';
import useFirebase from '@/hooks/use-firebase';
import Head from 'next/head';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="/">
        MFEE36 TEAM3
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const Login = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const { loginGoogle, logoutFirebase } = useFirebase();

  //引入useRouter，之後切換頁面時使用
  const router = useRouter();

  //引入useContext存放的setState，之後會把localStorage裡面的token存進去

  const handleSubmit = (event) => {
    //mui內建寫好，取消表單內建事件
    event.preventDefault();

    //創建一個FormData物件，把表單資料存進裡面
    const data = new FormData(event.currentTarget);

    //使用fetch方法，把FormData物件內的指定資料傳到後端
    fetch(process.env.API_SERVER + '/member/login', {
      method: 'POST',
      body: JSON.stringify({
        account: data.get('email'),
        password: data.get('password'),
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const obj = { ...data.data };
          localStorage.setItem('auth', JSON.stringify(obj));
          Swal.fire({
            title: '登入成功',
            timer: 1500,
            icon: 'success',
            showConfirmButton: false,
          });
          // setAuth(JSON.parse(localStorage.getItem('auth')));
          setTimeout(() => {
            router.back();
          }, 1000);
        } else {
          Swal.fire({
            title: '帳號或密碼錯誤',
            timer: 1500,
            icon: 'error',
            showConfirmButton: false,
          });
        }
      });
  };

  // google登入的function
  const callbackGoogleLogin = async (providerData) => {
    // console.log(providerData);

    const res = await axios.post(
      process.env.API_SERVER + '/member/googlelogin',
      providerData,
      {
        withCredentials: true, // 注意: 必要的，儲存 cookie 在瀏覽器中
      }
    );

    // console.log(res.data);

    if (res.data.success) {
      const obj = { ...res.data.data };
      localStorage.setItem('auth', JSON.stringify(obj));
      Swal.fire({
        title: '登入成功',
        timer: 1500,
        icon: 'success',
        showConfirmButton: false,
      });
      // setAuth(JSON.parse(localStorage.getItem('auth')));
      setTimeout(() => {
        if (router.asPath.includes('localhost')) {
          router.back();
        } else {
          router.push('/');
        }
      }, 1500);
    }
  };

  const [loginInfo, setLoginInfo] = useState({
    account: '',
    password: '',
  });
  const getLoginInfo = (e) => {
    const newLoginInfo = { ...loginInfo, [e.target.name]: e.target.value };
    setLoginInfo(newLoginInfo);
  };

  // 設置要放登入後接住的帳號跟sid還有店名
  const [loginSuccess, setLoginSuccess] = useState({
    account: '',
    shop: '',
    sid: '',
    error: '',
  });

  const resHandleSubmit = async (event) => {
    event.preventDefault();
    fetch('http://localhost:3002/res-login', {
      method: 'POST',
      body: JSON.stringify(loginInfo),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((r) => r.json())
      .then((data) => {
        // console.log(data);
        if (data.success) {
          const newloginSuccess = {
            ...loginSuccess,
            account: data.rows[0].account,
            shop: data.rows[0].shop,
            sid: data.rows[0].sid,
          };
          setLoginSuccess(newloginSuccess);
          localStorage.setItem('res-auth', JSON.stringify(data.data));

          Swal.fire('登入成功!', '', 'success');
          router.push('/res/res-order-management');
        } else {
          const newloginfail = { ...loginSuccess, error: data.error };
          setLoginSuccess(newloginfail);
          Swal.fire({
            title: '帳號或密碼錯誤',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
  };

  useEffect(() => {
    if (loginSuccess.account == true) {
      setLoginSuccess({ ...loginSuccess, error: '' });
      // console.log(loginSuccess);
    }
    if (loginSuccess.account == false) {
      // console.log(loginSuccess);
    }
  }, [loginSuccess]);

  const [change, setChange] = React.useState(false);

  return (
    <>
      <Head>
        <title>食GOEAT! </title>
      </Head>
      <div className={styles.container}>
        <div>
          <div className={styles.logintext}>選擇登入身分</div>
          <div className={styles.littleBox}>
            <MemLoginBtn change={change} setChange={setChange} />
          </div>
        </div>

        <div className={styles.area2}>
          {change ? (
            <div className={styles.cardBody}>
              <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                  <CssBaseline />
                  <Box
                    sx={{
                      marginTop: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      src="/member/hamburger.png"
                      width={100}
                      height={100}
                      alt=""
                    />
                    <Typography
                      component="h1"
                      variant="h5"
                      sx={{ fontFamily: 'var(--ff1)', color: '#921010' }}
                    >
                      廠商登入
                    </Typography>
                    {/* <div class="mb-3">
                    <input
                      className=""
                      type="email"
                      name="account"
                      class="form-control"
                      id="account"
                      placeholder="請輸入帳號"
                      value={loginInfo.account}
                      onChange={getLoginInfo}
                    />
                    <div style={{ color: 'red' }}>{loginSuccess.error}</div>
                  </div>
                  <div class="mb-3">
                    <input
                      type="password"
                      class="form-control"
                      name="password"
                      id="password"
                      placeholder="請輸入密碼"
                      onChange={getLoginInfo}
                      
                    />
                    <div style={{ color: 'red' }}>{loginSuccess.error}</div>
                  </div> */}

                    <Box
                      component="form"
                      onSubmit={resHandleSubmit}
                      noValidate
                      sx={{ mt: 1 }}
                    >
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="account"
                        label="帳號"
                        name="account"
                        autoComplete="email"
                        color="warning"
                        value={loginInfo.account}
                        onChange={getLoginInfo}
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="密碼"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        color="warning"
                        value={loginInfo.password}
                        onChange={getLoginInfo}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color="warning"
                        onChange={() => {}}
                        onSubmit={resHandleSubmit}
                        style={{
                          fontSize: '13px',
                          fontFamily: 'Zen Maru Gothic',
                          marginTop: 16,
                        }}
                      >
                        登入
                      </Button>
                      <Grid container>
                        <Grid item xs>
                          <Link
                            href="#"
                            variant="body2"
                            className={styles.text}
                          >
                            忘記密碼?
                          </Link>
                        </Grid>
                        <Grid item>
                          <Link
                            href="/res/res-register-form"
                            variant="body2"
                            className={styles.text}
                          >
                            {'尚未註冊?'}
                          </Link>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Container>
                <Copyright sx={{ mt: 8, mb: 4 }} />
              </ThemeProvider>
            </div>
          ) : (
            <div className={styles.cardBody2}>
              <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                  <CssBaseline />
                  <Box
                    sx={{
                      marginTop: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      src="/member/cookie3.png"
                      width={100}
                      height={100}
                      alt=""
                    />
                    <Typography
                      component="h1"
                      variant="h5"
                      sx={{ fontFamily: 'var(--ff1)', color: '#921010' }}
                    >
                      會員登入
                    </Typography>

                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      noValidate
                      sx={{ mt: 1 }}
                    >
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="帳號"
                        name="email"
                        autoComplete="email"
                        color="warning"
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="密碼"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        color="warning"
                      />

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 10 }}
                        color="warning"
                      >
                        <div
                          style={{
                            fontSize: '13px',
                            fontFamily: 'Zen Maru Gothic',
                          }}
                        >
                          登入
                        </div>
                      </Button>

                      <Grid container>
                        <Grid item xs>
                          <Link
                            href="#"
                            variant="body2"
                            className={styles.text}
                          >
                            忘記密碼?
                          </Link>
                        </Grid>
                        <Grid item>
                          <Link
                            href="./member/form"
                            variant="body2"
                            className={styles.text}
                          >
                            {'尚未註冊?'}
                          </Link>
                        </Grid>
                      </Grid>
                    </Box>
                    <button
                      className={styles.google}
                      onClick={() => loginGoogle(callbackGoogleLogin)}
                    >
                      <GoogleLogo />
                      Google登入
                    </button>
                  </Box>
                </Container>
                <Copyright sx={{ mt: 8, mb: 4 }} />
              </ThemeProvider>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Login.getLayout = BlankLayout;
export default Login;
