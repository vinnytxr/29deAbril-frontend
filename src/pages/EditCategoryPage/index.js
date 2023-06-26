import './styles.css'

import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';

import { FaTrash } from 'react-icons/fa';
import { IoSave } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { CategoryAPI } from '../../api/category';
import { HttpStatus } from '../../api/default';

export function EditCategoryPage() {
  const [categories, setCategories] = React.useState([])

  const [pageState, setPageState] = React.useState({ error: false, loading: true, showCategoryOptions: false, selectedCategoryId: null, allowOptionsBtn: true })

  const { id } = useParams();

  const inputEditCategoryRef = React.useRef(null)

  React.useEffect(() => {
    getInitialData()
  }, [id])

  return !pageState.error && !pageState.loading ? (
    <Container className='pt-3 edit-category-page'>
      <Row>
        <Col xs={7}>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <h3 className='text-center'>Categorias do curso</h3>
            <SortableContext
              items={categories.map(c => c.id)}
              strategy={verticalListSortingStrategy}
              disabled={!pageState.allowOptionsBtn}
            >
              <section
                style={{ 'height': '80vh', 'overflowY': 'scroll', 'overflowX': 'scroll', 'border': '0px solid green' }}
                className='px-5 category-dnd-container'
              >
                {categories.map(category => <SortableItem key={category.id} id={category.id} showCategoryOptions={showCategoryOptions} name={category.name} count={category.lessons.length} />)}
              </section>
            </SortableContext>
          </DndContext>
        </Col>
        <Col xs={5}>
          <h3 className='text-center'>Criar nova categoria</h3>
          <div className='w-100 d-flex flex-row justify-content-between mt-4'>
            <input
              id='create-course-category-input'
              type='text'
              className='w-100 me-1 px-1'
              style={{ 'fontSize': '14px' }}
            />
            <Button
              onClick={() => {
                const inputElement = document.getElementById('create-course-category-input')
                const inputValue = inputElement.value;

                console.log(inputValue)

                inputElement.value = '';
              }}
              className='add-category-btn'
            >
              <FaPlus />
            </Button>
          </div>

          {pageState.showCategoryOptions && <h3 className='text-center mt-5'>Opções da Categoria</h3>}
          <input
            id='edit-course-category-input'
            ref={inputEditCategoryRef}
            type='text'
            className='w-100 me-1 px-1'
            style={{ 'fontSize': '14px', 'textAlign': 'center', visibility: pageState.showCategoryOptions ? 'visible': 'hidden' }}
            autoComplete='off'
            spellCheck={false}
            disabled={!pageState.allowOptionsBtn}
          />

          {
            pageState.showCategoryOptions &&
            <>
              <div className='w-100 d-flex flex-row justify-content-between mt-2'>
                <Button
                  onClick={handleUpdateCategory}
                  disabled={!pageState.allowOptionsBtn}
                  className='save-category-btn'
                >
                  <IoSave />
                </Button>
                <Button
                  onClick={() => {
                    const inputElement = document.getElementById('edit-course-category-input')
                    const inputValue = inputElement.value;

                    console.log(inputValue)

                    inputElement.value = '';
                  }}
                  disabled={!pageState.allowOptionsBtn}
                  className='rm-category-btn'
                >
                  <FaTrash />
                </Button>
              </div>
            </> || <h6 className='text-justify pt-5' >Use duplo clique na categoria para ver outras opções, ou arraste o card para editar a ordem das categorias!</h6>
          }

        </Col>
      </Row>
    </Container>
  ) : <></>;

  function showCategoryOptions(categoryId) {
    const category = categories.find(c => c.id == categoryId)

    console.log('ref', inputEditCategoryRef)

    if (category && inputEditCategoryRef.current) {

      inputEditCategoryRef.current.value = category.name;

      setPageState({ ...pageState, showCategoryOptions: true, selectedCategoryId: categoryId })
    }
  }

  async function getInitialData() {
    const response = await CategoryAPI.getCategoriesByCourse(id);

    if (response.status === HttpStatus.OK && response.data) {
      setCategories(response.data.categories);

      setTimeout(() => setPageState({ ...pageState, error: false, loading: false, allowOptionsBtn: true }), 1000)
    }
    else setPageState({ ...pageState, error: true, loading: false, allowOptionsBtn: true });
  }

  async function handleUpdateCategory() {
    const categoryId = pageState.selectedCategoryId;
    const category = categories.find(c => c.id == categoryId)

    if (!!category && inputEditCategoryRef.current) {
      setPageState({ ...pageState, allowOptionsBtn: false });
      const updateBody = { name: inputEditCategoryRef.current.value, lessons_order: category.lessons_order }
      await CategoryAPI.updateCategory(category.id, updateBody);
      getInitialData();
    }
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

        (async () => {
          const r = await CategoryAPI.updateCourseCategoriesOrder(id, orderedCategories.map(c => c.id));
          console.log('update: ', r);
        })()

        return orderedCategories;
      })

      // setLanguages(items => {
      //   const activeIndex = items.indexOf(active.id);
      //   const overIndex = items.indexOf(over.id);

      //   console.log(arrayMove(items, activeIndex, overIndex))
      //   return arrayMove(items, activeIndex, overIndex);
      // })
    }
  }
}