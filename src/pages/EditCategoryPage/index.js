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
import { toast } from 'react-toastify'

export function EditCategoryPage() {
  const [categories, setCategories] = React.useState([])

  const [pageState, setPageState] = React.useState({ error: false, loading: true, showCategoryOptions: false, selectedCategoryId: null, allowOptionsBtn: true, allowCreateCategory: true })

  const { id } = useParams();

  const inputEditCategoryRef = React.useRef(null)
  const inputCreateCategoryRef = React.useRef(null)

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
              ref={inputCreateCategoryRef}
              type='text'
              className='w-100 me-1 px-1'
              style={{ 'fontSize': '14px' }}
              disabled={!pageState.allowCreateCategory}
            />
            <Button
              onClick={handleCreateCategory}
              className='add-category-btn'
              disabled={!pageState.allowCreateCategory}
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
            style={{ 'fontSize': '14px', 'textAlign': 'center', visibility: pageState.showCategoryOptions ? 'visible' : 'hidden' }}
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
                  onClick={handleDeleteCategory}
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

      setTimeout(() => setPageState({ ...pageState, error: false, loading: false, allowOptionsBtn: true, allowCreateCategory: true }), 1000)
    }
    else setPageState({ ...pageState, error: true, loading: false, allowOptionsBtn: true, allowCreateCategory: true });
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

  async function handleDeleteCategory() {
    const categoryId = pageState.selectedCategoryId;
    const category = categories.find(c => c.id == categoryId)

    if (category && category.lessons.length > 0)
      notifyError("Apenas categorias vazias podem ser deletadas!")
    else if(categories.length <= 1)
      notifyError("O curso deve possuir ao menos uma categoria!")  
    else if (category && categoryId) {
      setPageState({ ...pageState, allowOptionsBtn: false });
      await CategoryAPI.deleteCategory(categoryId);
      await getInitialData();
      setTimeout(() => setPageState({ ...pageState, error: false, loading: false, allowOptionsBtn: true, showCategoryOptions: false, selectedCategoryId: null }), 1000)
    }
  }

  async function handleCreateCategory() {
    if (inputCreateCategoryRef.current) {
      setPageState({ ...pageState, allowCreateCategory: false });
      await CategoryAPI.createCategory(id, inputCreateCategoryRef.current.value)
      inputCreateCategoryRef.current.value = ''
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
    }
  }

  function notifyError(texto) {
    toast.error(texto, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
  }

}