import './sortable-item-styles.css';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from 'react-bootstrap';

export function SortableItem(props) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const imgSrc = "data:image/png;base64,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";

  return (
    <div ref={setNodeRef} style={{...style}} {...attributes} {...listeners} className='sortable-item'>
      <Card className='m-3'>
        <Card.Body className='p-3'>
          <section className='d-flex flex-row justify-content-center align-items-center'>
            {props.id}
          </section>
        </Card.Body>
      </Card>
    </div>
  );
}