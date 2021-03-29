package ua.knu.domain.repository;

import java.util.Optional;

public interface CrudRepository<T, ID> {

    <S extends T> S save(S entity);

    <S extends T> Iterable<S> saveAll(Iterable<S> entities);

    Optional<T> findById(ID id);

    Iterable<T> findAll();

    void delete(T entity);

    void deleteAll(Iterable<? extends T> entities);
}
