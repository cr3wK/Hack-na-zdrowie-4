import { NameInput, Room } from 'components'
import { USER_KEY } from 'constants'
import storage from 'utils/storage'
import { useNavigate } from 'react-router-dom'
export const Home = () => {
  const user = storage.get(USER_KEY)
  const navigate = useNavigate()
  if (!user) {
    navigate("/login")
  }
  return <Room />
}
