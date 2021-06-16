package ua.knu.persistence.repository;

import org.apache.commons.lang3.NotImplementedException;

import java.util.Collection;
import java.util.Optional;

public interface CrudRepository<T, ID> {

    default <S extends T> S save(S entity) {
        throw new NotImplementedException();
    }

    default <S extends T> Iterable<S> saveAll(Iterable<S> entities) {
        throw new NotImplementedException();
    }

    default Optional<T> findById(ID id) {
        throw new NotImplementedException();
    }

    default Collection<T> findAll() {
        throw new NotImplementedException();
    }

    default void delete(T entity) {
        throw new NotImplementedException();
    }

    default void deleteAll(Iterable<? extends T> entities) {
        throw new NotImplementedException();
    }
}
