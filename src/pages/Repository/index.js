import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import api from '../../services/api';
import Container from '../../components/Container';
import { Loading, PageList, Owner, IssuesList } from './styles';

export default class Repository extends Component {
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      repository: {},
      issues: [],
      state: 'open',
      page: 1,
      loading: true,
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  applyParams = async () => {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);
    const { state, page } = this.state;

    // this.setState({ loading: true });

    console.log(page);

    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state,
        per_page: 5,
        page,
      },
    });

    this.setState({
      issues: issues.data,
      loading: false,
    });
  };

  handleButton = async state => {
    await this.setState({ state });
    this.applyParams();
  };

  handlePage = async page => {
    await this.setState({ page });
    this.applyParams();
  };

  render() {
    const { repository, issues, loading, page } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
          <span>
            <button type="button" onClick={() => this.handleButton('open')}>
              Abertas
            </button>
            <button type="button" onClick={() => this.handleButton('closed')}>
              Fechadas
            </button>
            <button type="button" onClick={() => this.handleButton('all')}>
              Todas
            </button>
          </span>
        </Owner>

        <IssuesList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}{' '}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssuesList>
        <PageList>
          {page !== 1 ? (
            <button type="button" onClick={() => this.handlePage(page - 1)}>
              {'<<'} Anterior
            </button>
          ) : (
            <></>
          )}
          <button type="button" onClick={() => this.handlePage(page + 1)}>
            Próxima {'>>'}
          </button>
        </PageList>
      </Container>
    );
  }
}
