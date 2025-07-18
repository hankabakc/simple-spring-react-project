// src/main/java/com/table/table/exception/ErrorResponse.java

package com.table.table.dto.response;

import java.util.Date; // EKLE
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude; // EKLE

@JsonInclude(JsonInclude.Include.NON_NULL) // Null alanları JSON çıktısına dahil etmez
public class ErrorResponse {
    private Date timestamp;
    private int status;
    private String message;
    private String details;
    private Map<String, String> errors; // Validasyon hataları için

    public ErrorResponse(Date timestamp, int status, String message, String details) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.details = details;
    }

    // MethodArgumentNotValidException için kullanılacak constructor
    public ErrorResponse(Date timestamp, int status, String message, String details, Map<String, String> errors) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.details = details;
        this.errors = errors;
    }

    // Getter metotları
    public Date getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public String getDetails() {
        return details;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    // Setter'lara genellikle gerek yok, çünkü response DTO'ları immutable
    // olmalıdır.
    // Ancak istersen ekleyebilirsin.
}