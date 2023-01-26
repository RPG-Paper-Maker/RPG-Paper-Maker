/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETPICTURE_H
#define WIDGETPICTURE_H

#include <QWidget>
#include <QListWidget>
#include "systempicture.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS WidgetPicture
//
//  Widget used for choosing a picture existing in the database.
//
// -------------------------------------------------------

namespace Ui {
class WidgetPicture;
}

class WidgetPicture : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetPicture(QWidget *parent = nullptr);
    ~WidgetPicture();
    QListWidget* list() const;
    SystemPicture* picture() const;
    void setKind(PictureKind kind);
    void setPicture(SystemPicture* picture);
    int pictureIndexX() const;
    void setPictureIndexX(int pictureIndexX);
    int pictureIndexY() const;
    void setPictureIndexY(int pictureIndexY);
    void setIsLimitIndex(bool isLimitIndex);
    void initialize(int i = 1, int indexX = 0, int indexY = 0);
    void initializeSuper(SuperListItem *super, SuperListItem *indexX = nullptr,
        SuperListItem *indexY = nullptr);
    void initializePrimitive(PrimitiveValue *value, QStandardItemModel *properties =
        nullptr, QStandardItemModel *parameters = nullptr);
    void openDialog();

private:
    Ui::WidgetPicture *ui;
    PictureKind m_kind;
    int m_picture;
    SuperListItem *m_pictureID;
    int m_pictureIndexX;
    SuperListItem *m_indexXID;
    int m_pictureIndexY;
    SuperListItem *m_indexYID;
    bool m_isLimitIndex;
    PrimitiveValue *m_valueID;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

private slots:
    void on_listWidget_itemDoubleClicked(QListWidgetItem*);
    void on_pushButton_clicked();

signals:
    void pictureChanged(SystemPicture* picture);
    void indexChanged(int indexX, int indexY);
};

#endif // WIDGETPICTURE_H
