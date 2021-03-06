import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import uuidv4 from 'uuid/v4';
import { getNewPrivateKey } from '../helpers/helpers';
import './CreateContainer.scss';

class CreateContainer extends Component {
  state = {
    gameId: null,
  };
  componentDidMount() {
    const gameId = uuidv4();
    const { isRandomGame } = this.props;
    const privateKey = isRandomGame ? null : getNewPrivateKey();
    this.setState({ gameId, privateKey });
  }
  render() {
    const { gameId, privateKey } = this.state;
    const { userId, isRandomGame, history } = this.props;
    const text = isRandomGame
      ? 'Create a random game'
      : 'Create a private game';

    /*
     *  Creates a user and a game. The game is createdBy the user,
     *  and the game id is stored in the user row as gameId.
     *  The game status is initially set to "pending".
     */

    const CREATE_GAME = gql`
      mutation {
        insert_games(objects: [
          {
            id: "${gameId}",
            status: "pending",
            createdBy: "${userId}",
            privateKey: "${privateKey}"
          }
        ]) {
          affected_rows
        }
      }
    `;

    const UPDATE_USER = gql`
      mutation {
        update_users(
          where: { id: {_eq: "${userId}"} },
          _set: { gameId: "${gameId}" }
        ) {
          affected_rows
        }
      }
    `;
    return (
      <Mutation mutation={UPDATE_USER}>
        {(updateUser, userInfo) => (
          <Mutation mutation={CREATE_GAME}>
            {(createGame, gameInfo) => {
              if (gameInfo.data && !userInfo.loading && !userInfo.data) {
                updateUser();
              }
              if (gameInfo.data && userInfo.data) {
                history.push('/lobby', {
                  createdByUser: true,
                  isRandomGame,
                  privateKey,
                  userId,
                  gameId,
                });
              }
              return (
                <button
                  className="CreateContainer__button"
                  onClick={() => {
                    createGame();
                  }}
                >
                  {text}
                </button>
              );
            }}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default CreateContainer;
