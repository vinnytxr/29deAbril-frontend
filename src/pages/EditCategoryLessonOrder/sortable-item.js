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

  return (
    <div ref={setNodeRef} style={{...style}} {...attributes} {...listeners} className='sortable-item-category' >
      <Card className='m-3' >
        <Card.Body className='p-3' >
          <section className='d-flex flex-row justify-content-start align-items-center'>
            <img src={props.img} style={{'width':'120px', 'aspectRatio': '16/9', 'marginRight': '1rem', 'borderRadius':'5px'}}/>
            <span>
              {`${props.name}`}
            </span>
            
          </section>
        </Card.Body>
      </Card>
    </div>
  );
}