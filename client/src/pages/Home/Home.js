import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import storage from 'utils/storage'
import { USER_KEY } from 'constants'
import { Room } from 'components'

export const Home = () => {
  // const { roomId } = useParams()

  const navigate = useNavigate()

  useEffect(() => {
    const user = storage.get(USER_KEY)
    if (!user) {
      navigate('/login')
    }
  }, [navigate])
  const valid_user = storage.get(USER_KEY)
  return <Room roomId={valid_user.roomId} />
}
