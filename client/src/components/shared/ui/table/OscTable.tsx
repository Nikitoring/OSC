import React, { ReactNode } from 'react'
import './Table.css'

// конфигурации колонки
export interface ColumnConfig<T = any> {
  key: string // Ключ из объекта data
  title: string // Название колонки в шапке
  align?: 'left' | 'center' | 'right' // Выравнивание текста
  width?: string | number // Ширина колонки
  render?: (value: any, row: T, index: number) => ReactNode
}

export interface TableProps<T = any> {
  columns: ColumnConfig<T>[]
  data: T[]
  borderless?: boolean // Убирает границы
  showHeader?: boolean // Скрывает/показывает шапку
  rowKey?: keyof T | ((row: T) => string | number) // Уникальный ключ для строки
  emptyText?: string // Текст, если данных нет
}

export const OscTable = <T extends Record<string, any>>({
  columns,
  data,
  borderless = false,
  showHeader = true,
  rowKey = 'id', // По умолчанию ищем поле 'id'
  emptyText = 'Нет данных',
}: TableProps<T>) => {
  // Вспомогательная функция для получения уникального ключа строки
  const getRowKey = (row: T, index: number): string | number => {
    if (typeof rowKey === 'function') return rowKey(row)
    return row[rowKey] !== undefined ? row[rowKey] : index
  }

  return (
    <table className={`custom-table ${borderless ? 'borderless' : ''}`}>
      {showHeader && (
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: col.align || 'left',
                  width: col.width,
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={getRowKey(row, rowIndex)}>
              {columns.map((col) => {
                const value = row[col.key]
                return (
                  <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                    {/* Если передана функция render, используем её, иначе просто значение */}
                    {col.render ? col.render(value, row, rowIndex) : value}
                  </td>
                )
              })}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="empty-state">
              {emptyText}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
