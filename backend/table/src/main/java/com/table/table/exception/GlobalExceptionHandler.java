// src/main/java/com/table/table/exception/GlobalExceptionHandler.java

package com.table.table.exception;

import java.util.Date;
import java.util.HashMap;
import java.util.Map; // Spring Security yetkilendirme hatası
import java.util.NoSuchElementException; // @Valid anotasyon hataları için

import org.springframework.http.HttpStatus; // Eksik @RequestParam için
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException; // Parametre tip uyuşmazlığı için
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException; // findById().orElseThrow() için

import com.table.table.dto.response.ErrorResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Kullanıcı bulunamadı veya yetkilendirme hatası gibi özel durumlar için
    // (401/403)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        ErrorResponse errorDetails = new ErrorResponse(
                new Date(),
                HttpStatus.FORBIDDEN.value(),
                "Access Denied: You do not have permission to access this resource.",
                request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.FORBIDDEN);
    }

    // Örneğin, belirli bir ID ile eleman bulunamadığında (404 Not Found)
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResponse> handleNoSuchElementException(NoSuchElementException ex, WebRequest request) {
        ErrorResponse errorDetails = new ErrorResponse(
                new Date(),
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage() != null ? ex.getMessage() : "Resource not found.",
                request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    // @RequestParam veya @PathVariable gibi yerlerde parametreler eksikse (400 Bad
    // Request)
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParams(MissingServletRequestParameterException ex,
            WebRequest request) {
        ErrorResponse errorDetails = new ErrorResponse(
                new Date(),
                HttpStatus.BAD_REQUEST.value(),
                ex.getParameterName() + " parameter is missing.",
                request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    // Parametre tipi uyuşmazlığı (örn: ID için string göndermek) (400 Bad Request)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex,
            WebRequest request) {
        ErrorResponse errorDetails = new ErrorResponse(
                new Date(),
                HttpStatus.BAD_REQUEST.value(),
                "Parameter '" + ex.getName() + "' has invalid type: " + ex.getValue(),
                request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    // @Valid anotasyonu ile yapılan validasyon hataları için (400 Bad Request)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        ErrorResponse errorDetails = new ErrorResponse(
                new Date(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                request.getDescription(false),
                errors);
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    // Genel tüm diğer istisnalar için (500 Internal Server Error)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        ErrorResponse errorDetails = new ErrorResponse(
                new Date(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "An unexpected error occurred: " + ex.getMessage(),
                request.getDescription(false));
        // Loglama için
        System.err.println("Unexpected error: " + ex.getClass().getName() + " - " + ex.getMessage());
        ex.printStackTrace(); // Geliştirme ortamında stack trace görmek faydalıdır

        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}