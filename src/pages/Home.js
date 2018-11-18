import React, { Component } from 'react';
import GetNewUser from '../components/GetNewUser';
import FlexWrapper from '../components/FlexWrapper';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  state = {
    user: {},
  };
  componentDidMount() {
    // Get user info from local storage if it exists
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.setState({ user });
    }
  }
  updateUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    this.setState({ user });
  }
  render() {
    const { user } = this.state;
    return (
      <FlexWrapper>
        {user.userId && user.username && (
          <div>
            <p style={{ textAlign: 'center', marginBottom: '0px' }}>{`Hello, ${
              user.username
            }!`}</p>
            <button
              onClick={() =>
                this.setState({
                  user: { userId: user.userId, username: null },
                })
              }
            >
              Edit Name
            </button>
          </div>
        )}
        <p
          style={{
            padding: '0 1rem',
            textAlign: 'center',
          }}
        >
          This app was developed in a small incubator inside Microsoft.
          <span role="img" aria-label="nonsense emojis">
            🥑 😉
          </span>
          <br />
          <sub>
            <em>#JAMstackHackathon2018</em>
          </sub>
        </p>
        {user.userId && user.username ? (
          <div style={{ textAlign: 'center' }}>
            <Link
              style={{ display: 'block' }}
              to={{ pathname: '/create', state: { user } }}
            >
              Create a game
            </Link>
            <Link
              style={{ display: 'block' }}
              to={{ pathname: '/join', state: { user } }}
            >
              Join a game
            </Link>
          </div>
        ) : (
          <GetNewUser updateUser={this.updateUser.bind(this)} user={user} />
        )}
      </FlexWrapper>
    );
  }
}
