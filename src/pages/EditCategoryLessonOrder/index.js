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
  const [categories, setCategories] = React.useState([])

  const [pageState, setPageState] = React.useState({ error: false, loading: true })

  const { categoryId } = useParams();

  React.useEffect(() => {
    getInitialData()
  }, [categoryId])

  return !pageState.error && !pageState.loading ? (
    <Container className='pt-3 edit-category-page'>
      <Row>
        <Col xs={7}>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <h3 className='text-center'>Alterar ordem das aulas</h3>
            <SortableContext
              items={categories.map(c => c.id)}
              strategy={verticalListSortingStrategy}
              disabled={false}
            >
              <section
                style={{ 'height': '80vh', 'overflowY': 'scroll', 'overflowX': 'scroll', 'border': '0px solid green' }}
                className='px-5 category-dnd-container'
              >
                {categories.map(category => <SortableItem key={category.id} id={category.id} name={category.title} />)}
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
      setCategories(response.data.lessons);

      setTimeout(() => setPageState({ ...pageState, error: false, loading: false }), 1000)
    }
    else setPageState({ ...pageState, error: true, loading: false });
  }

  function handleDragEnd(event) {
    console.log("Drag end called")
    const { active, over } = event;

    if (active.id !== over.id) {
      console.log(active.id, over.id)
      setCategories(items => {
        console.log('items', items)
        const activeIndex = items.map(i => i.id).indexOf(active.id);
        const overIndex = items.map(i => i.id).indexOf(over.id);

        const orderedCategories = arrayMove(items, activeIndex, overIndex);

        // (async () => {
        //   const r = await CategoryAPI.updateCourseCategoriesOrder(id, orderedCategories.map(c => c.id));
        //   console.log('update: ', r);
        // })()

        return orderedCategories;
      })
    }
  }

}