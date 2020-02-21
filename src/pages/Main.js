import React, {useState, useCallback, useEffect} from 'react'
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa'
import api from '../services/api'
import {Link} from 'react-router-dom'

import {Container, Form, SubmitButton, List, DeleteButton} from './styles'

function Main(){
    const [newRepo, setNewRepo] = useState('')
    const [repositorys, setRepositorys] = useState([])
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)

    //Search
    useEffect(() => {
        const repoStorage = localStorage.getItem('repos')

        if(repoStorage){
            setRepositorys(JSON.parse(repoStorage))
        }
    }, [])

    //Save alterations
    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorys))
    }, [repositorys])

    const handleinputChange = e => {
        setNewRepo(e.target.value)
        setAlert(null)
    }

    const handleSubmit = useCallback(e => {
        e.preventDefault()

       const submit = async() => {
           setLoading(true)
           setAlert(null)

           try{
            
                if(newRepo === ""){
                    throw new Error("You need indicate a repository")
                }
                const response = await api.get(`repos/${newRepo}`)

                const hasRepo = repositorys.find(repo => repo.name === newRepo)

                if (hasRepo){
                    throw new Error("Duplicated Repository")
                }

                const data = {
                    name: response.data.full_name,
                }
    
                setRepositorys([...repositorys, data])
                setNewRepo('')

           }catch(error){
               setAlert(true)
              console.log(error)  
           }finally{
            setLoading(false)
           }
       
       }

       submit()
    }, [newRepo, repositorys])

    const handleDelete = useCallback(repo => {
        const find = repositorys.filter(r => r.name !== repo)
        setRepositorys(find)
    }, [repositorys])

    return(
        <Container>
            <h1>
                <FaGithub size={25} />
                My Repositories
            </h1>
            <Form onSubmit={handleSubmit} error={alert}>
                <input type="text" placeholder="Add Repositories"
                    value={newRepo}
                    onChange={handleinputChange}
                />
                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14} />
                    ) : (
                        <FaPlus color="#fff" size={14} />
                    )}
                    
                </SubmitButton>
            </Form>
            <List>
                {repositorys.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repository/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    )
}

export default Main