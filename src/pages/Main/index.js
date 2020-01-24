import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';
import { Form, SubmitButton, Container, List } from './styles';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newRepo: '',
      repositories: [
        { name: 'VUE/VUE' },
        { name: 'facebook/react' },
        { name: 'angular/angular' },
      ],
      loading: false,
    };
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    const { newRepo, repositories } = this.state;

    this.setState({ loading: true });

    const response = await api.get(`repos/${newRepo}`);

    const data = {
      name: response.data.full_name,
    };

    this.setState({
      repositories: [...repositories, data],
    });

    this.setState({ loading: false, newRepo: '' });
  };

  render() {
    const { newRepo, repositories, loading } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              {repository.name}
              <a href="#">Detalhes</a>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
