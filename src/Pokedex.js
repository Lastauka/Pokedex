import axios from 'axios';
import React, { Component } from 'react';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory,  { PaginationProvider } from 'react-bootstrap-table2-paginator';

import BootstrapTable from 'react-bootstrap-table-next';

const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name'
}, {
  dataField: 'price',
  text: 'Product Price'
}];

const options = {
  custom: true,
  totalSize: 10
};

export class Pokedex extends React.Component {
    state = {
        total: 10,
        offset: 0,
        pageSize: 10,
        pokemonInfo: [],
        columns: [{
            dataField: 'name',
            text: 'name',
            filter: textFilter()

        },
        {
            dataField: 'image',
            text: 'image',
        },
        {
            dataField: 'types',
            text: 'types',
            filter: textFilter()
        }]
    }
  handleNextPage = ({
    page,
    onPageChange
  }) => () => {
    this.setState({
        offset: this.state.offset + this.state.pageSize
    })
    this.loadPokemons(this.state.offset+this.state.pageSize, this.state.pageSize)
    onPageChange(page + 1);
  }

  handlePrevPage = ({
    page,
    onPageChange
  }) => () => {
    if(page>1) onPageChange(page - 1);
  }

  loadPokemons(offset, limit){
    axios.get('https://pokeapi.co/api/v2/pokemon?offset='+offset+'&limit='+limit).then(response => {
        const linkToResolve = response.data.results.map(x => x.url);
        linkToResolve.map(x => axios.get(x).then(pokemonDetails => {
            const currentState = this.state.pokemonInfo

            const ourPokemonData = {
                "name": pokemonDetails.data.name,
                "types": pokemonDetails.data.types.map(x => x.type.name).toString(),
                "image": <img src={pokemonDetails.data.sprites.front_default} />
            }
            currentState.push(ourPokemonData)
            this.setState(
                {
                    pokemonInfo: currentState
                }
            )
        }
        ));
    });
  }

  componentDidMount() {
    this.loadPokemons(0, this.state.pageSize)
  }
  render() {
    return (
      <div>
        <PaginationProvider
          pagination={ paginationFactory(options) }
        >
          {
            ({
              paginationProps,
              paginationTableProps
            }) => (
              <div>
                <div>
                    <h1>Yauheni Lastauka — Pokedex 2020 Allegro </h1>
                  <p>Current Page: { paginationProps.page }</p>
                </div>
                <div className="btn-group" role="group">
                <button className="btn btn-success" onClick={ this.handlePrevPage(paginationProps) }>Prev Page</button>
                <button className="btn btn-primary" onClick={ this.handleNextPage(paginationProps) }>Next Page</button>
                </div>
                <BootstrapTable
                  keyField="name"
                  data={ this.state.pokemonInfo }
                  columns={ this.state.columns }
                  filter={ filterFactory() }
                  { ...paginationTableProps }
                />
              </div>
            )
          }
        </PaginationProvider>
      </div>
    );
  }
} export default Pokedex