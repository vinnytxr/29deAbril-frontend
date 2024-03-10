import './styles.css'

import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import { useAuthContext } from '../../contexts/AuthContext'
import { useParams } from 'react-router-dom';
import { CategoryAPI } from '../../api/category';
import { HttpStatus } from '../../api/default';
import { toast } from 'react-toastify'
import Navbar from 'react-bootstrap/Navbar'
import Avatar from 'react-avatar'

export function EditCategoryLessonsOrder() {
  const [lessons, setLessons] = React.useState([])

  const [pageState, setPageState] = React.useState({ error: false, loading: true })

  const { categoryId } = useParams();
  const { logged, user } = useAuthContext() 

  React.useEffect(() => {
    getInitialData()
  }, [categoryId])

  return !pageState.error && !pageState.loading ? (
    <Container className='pt-3 edit-category-page'>
        <Navbar>
            {logged && user ? (
              <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                &#128075;&nbsp; Hey, {user?.name?.split(' ')[0]}!
              </p>
            ) : (
              <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                &#128075;&nbsp; BEM-VINDO!
              </p>
            )}

            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                {user && user.photo ? <img src={user.photo} style={{ width: '50px', aspectRatio: 1, borderRadius: '50%', objectFit: 'fill', objectPosition: 'center', cursor: 'pointer' }} alt="profile" />
                  : <Avatar
                      name={(user?.name && user?.name.split(' ')[0]) || "O i"}
                      color="#0f5b7a"
                      size={30}
                      textSizeRatio={2}
                      round={true}
                  />}
                {/* {user && (
                  <Avatar
                    name={user.name}
                    color="#0f5b7a"
                    size={30}
                    textSizeRatio={2}
                    round={true}
                  />
                )} */}
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>

      <Row className='mt-5'>
        <Col xs={12}>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <h3 className='text-center'>Alterar ordem das aulas</h3>
            <SortableContext
              items={lessons.map(c => c.id)}
              strategy={verticalListSortingStrategy}
              disabled={false}
            >
              <section
                style={{ 'height': '80vh', 'overflowY': 'scroll', 'overflowX': 'scroll', 'border': '0px solid green' }}
                className='px-5 category-dnd-container'
              >
                {lessons.map(category => <SortableItem key={category.id} id={category.id} name={category.title} img={category.banner}/>)}
              </section>
            </SortableContext>
          </DndContext>
        </Col>
      </Row>
    </Container>
  ) : <></>;

  async function getInitialData() {
    const response = await CategoryAPI.getCategoryById(categoryId);

    if (response.status === HttpStatus.OK && response.data) {
      setLessons(response.data.lessons);

      setTimeout(() => setPageState({ ...pageState, error: false, loading: false }), 1000)
    }
    else setPageState({ ...pageState, error: true, loading: false });
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLessons(items => {
        const activeIndex = items.map(i => i.id).indexOf(active.id);
        const overIndex = items.map(i => i.id).indexOf(over.id);

        const orderedlessons = arrayMove(items, activeIndex, overIndex);

        (async () => {
          const r = await CategoryAPI.updateCategory(categoryId, {'lessons_order': orderedlessons.map(c => c.id)});
        })()

        return orderedlessons;
      })
    }
  }

}
