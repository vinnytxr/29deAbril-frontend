import './styles.css'

import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';

export function EditCategoryPage() {
  const [languages, setLanguages] = useState([
    'javascript',
    'python',
    'typescript',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h'
  ]);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Container className='p-3' style={{ 'width': '50%'}} align='center'>
        <h3>The best programming languages</h3>
        <SortableContext
          items={languages}
          strategy={verticalListSortingStrategy}
        >
          <section
            style={{'height': '80vh', 'overflow-y': 'scroll', 'overflow-x': 'hidden'}}
          >
            {languages.map(language => <SortableItem key={language} id={language} />)}
          </section>
        </SortableContext>
      </Container>

    </DndContext>
  );

  function handleDragEnd(event) {
    console.log("Drag end called")
    const { active, over } = event;

    if (active.id !== over.id) {
      setLanguages(items => {
        const activeIndex = items.indexOf(active.id);
        const overIndex = items.indexOf(over.id);

        console.log(arrayMove(items, activeIndex, overIndex))
        return arrayMove(items, activeIndex, overIndex);
      })
    }
  }
}