import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset } from '../features/authSlice';
import { RootState, AppDispatch } from '../app/store'; // Ensure this import points to the correct path
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>(); // use AppDispatch type
  const { user, isError, isSuccess, isLoading, message } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isSuccess) {
        navigate('/dashboard');
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(LoginUser({ username, password }));
  };

  return (
    <section className="vh-100" style={{ backgroundColor: '#ffffff' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="shadow-2-strong" style={{ borderRadius: '1rem' }}>
              <form onSubmit={Auth}>
                <div className="card-body p-5">
                  <h3 style={{ fontWeight: 'bold' }}>Login</h3>
                  {isError && <p className="font-weight-bold text-danger">{message}</p>}
                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    id="loginButton"
                    className="btn btn-lg btn-block d-flex justify-content-between align-items-center"
                    type="submit"
                    style={{ backgroundColor: '#003f62', color: 'white', width: '100%' }}
                  >
                    <span>{isLoading ? 'Loading...' : 'LOGIN'}</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
