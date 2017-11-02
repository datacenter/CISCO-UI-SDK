import React from 'react'
import { Grid , Header} from 'semantic-ui-react'

const SummaryBox = () => {
  return (
    <div>
      <div className='panelGrid'>
         <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
                   <Header size='medium'>400</Header>
                  <div>Space</div>
            </Grid.Column>
            <Grid.Column>
              <Header size='medium'>2000W</Header>
               <div>Power consumption</div>
            </Grid.Column>
            <Grid.Column>
                <Header size='medium'>800</Header>
               <div>Monthly opex</div>
            </Grid.Column>
              <Grid.Column>
                  <Header size='medium'>500</Header>
                  <div>Monthly opex</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  )
};

export default SummaryBox
