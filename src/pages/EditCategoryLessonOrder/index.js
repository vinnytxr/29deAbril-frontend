import './styles.css'

import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';

import { useParams } from 'react-router-dom';
import { CategoryAPI } from '../../api/category';
import { HttpStatus } from '../../api/default';
import { toast } from 'react-toastify'

export function EditCategoryLessonsOrder() {
  const [lessons, setLessons] = React.useState([])

  const [pageState, setPageState] = React.useState({ error: false, loading: true })

  const { categoryId } = useParams();

  React.useEffect(() => {
    getInitialData()
  }, [categoryId])

  return !pageState.error && !pageState.loading ? (
    <Container className='pt-3 edit-category-page'>
      <Row>
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