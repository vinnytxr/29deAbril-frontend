import React from 'react'
import { Component } from 'react'

import './style.css'

import { Navbar, Card, ListGroup, ListGroupItem } from 'react-bootstrap'

import { SiBookstack} from 'react-icons/si'
import { FaUser } from 'react-icons/fa'
import { ImBooks } from 'react-icons/im'
import { GiArchiveRegister } from 'react-icons/gi'
import { TbLogin } from 'react-icons/tb'

const NavLinkTo = ({ href, title, icon }) => (
  <ListGroup horizontal>
    <ListGroup.Item
      style={{
        paddingLeft: '5px',
        paddingRight: '0px',
      }}
      className="li"
    >
      {icon}
    </ListGroup.Item>
    <ListGroup.Item className="li">
      <a
        className="hover-clic"
        style={{ color: '#8a9094' }}
        href={href}
      >
        {title}
      </a>
    </ListGroup.Item>
  </ListGroup>
)

const NavText = ({ text }) => (
  <Navbar.Text
    className="fw-bold"
    style={{
      fontSize: 'x-small',
      color: '#b4bbbf',
      paddingLeft: '16px',
    }}
  >
    {text}
  </Navbar.Text>
)

const NavGroupFlush = ({ children }) => (
  <ListGroup variant="flush">
    <ListGroupItem
      className="list"
      style={{
        paddingLeft: '15px',
        paddingRight: '0px',
      }}
    >
      {children}
    </ListGroupItem>
  </ListGroup>
)

const FAIcon = ({ Icon }) => (
  <Icon style={{ color: '#8a9094', fontSize: '18' }} className="me-2" /> 
)

class SideNav extends Component {
  constructor(props) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
    this.toggleNav = this.toggleNav.bind(this)
  }

  onSelect(e) {
    console.log('onSelect')
  }

  toggleNav() {
    console.log('toggle..')
  }

  render() {
    return (
      <Navbar className="home">
        <Card className="cardSide">
          <Card.Img
            className="cardSide-img-top mx-auto mt-2"
            variant="top"
            src={'https://i.ibb.co/DfGzNpM/logo.png'}
          />

          <Card.Body
            style={{
              paddingLeft: '0px',
              paddingRRight: '0px',
            }}
          >
            <NavText text='GERAL' />
            <NavGroupFlush>
              <NavLinkTo title='Meu Perfil' href='/perfil'  icon={<FAIcon Icon={FaUser} />} />
              <NavLinkTo title='Cadastre-se' href='/register'  icon={<FAIcon Icon={GiArchiveRegister} />} />
              <NavLinkTo title='Logar-se' href='/login'  icon={<FAIcon Icon={TbLogin} />} />
            </NavGroupFlush>

            <NavText text='ALUNO'/>
            <NavGroupFlush>
              <NavLinkTo title='Cursos' href='/students/courses'  icon={<FAIcon Icon={ImBooks} />} />
              <NavLinkTo title='Meus cursos' href='/students/enrolled-courses'  icon={<FAIcon Icon={SiBookstack} />} />
            </NavGroupFlush>

            <NavText text='PROFESSOR'/>
            <NavGroupFlush>
              <NavLinkTo title='Meus cursos' href='/professor/courses'  icon={<FAIcon Icon={ImBooks} />} />
              <NavLinkTo title='Criar curso' href='/professor/courses/create'  icon={<FAIcon Icon={SiBookstack} />} />
            </NavGroupFlush>
          </Card.Body>
        </Card>
      </Navbar>
    )
  }
  componentDidMount() { }
}

export default SideNav
