import {Dispatch, SetStateAction} from 'react';
import * as Popover from '@radix-ui/react-popover';
import Expenses from './Expenses';
import { EyeOpenIcon } from '@radix-ui/react-icons';

type PopUpProps = {
setShowExpense: Dispatch<SetStateAction<boolean>>;
  setUpdateExpense: Dispatch<SetStateAction<boolean>>;
  updateExpense: boolean;
  categoryName: string;
}

const PopUp: React.FC<PopUpProps> = ({ setShowExpense, setUpdateExpense, updateExpense, categoryName}) => {
    
console.log('in expenses')

return(
  <Popover.Root>
    <Popover.Trigger >
        <button className="IconButton" aria-label="Update dimensions"
        // onClick={() =>
        //     showCategoryExpenses(categoryName)
        //   }
        >
            <EyeOpenIcon />
        </button>
    </Popover.Trigger>
    <Popover.Anchor />
    <Popover.Portal>
      <Popover.Content
        sideOffset={0}
          alignOffset={0}
          side="bottom"
          align="end"
          className='w-full h-screen'
      >
            <Expenses
                setShowExpense={setShowExpense}
                categoryName={categoryName}
                setUpdateExpense={setUpdateExpense}
                updateExpense={updateExpense}
            />
        <Popover.Close />
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
)
};

export default PopUp;