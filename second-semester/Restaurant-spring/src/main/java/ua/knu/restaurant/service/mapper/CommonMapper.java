package ua.knu.restaurant.service.mapper;

import org.mapstruct.MapperConfig;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper from dto to entity and vice versa.
 *
 * @param <R> readDto
 * @param <W> writeDto
 * @param <E> entity
 */
@MapperConfig(unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CommonMapper<R, W, E> {

    R entityToDto(E entity);

    E dtoToEntity(W dto);
}
