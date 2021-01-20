/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
    void initialize(int i = 1);
    void initializeSuper(SuperListItem *super);
    void initializePrimitive(PrimitiveValue *value, SystemCommonObject *object =
        nullptr, QStandardItemModel *parameters = nullptr);
    void openDialog();

private:
    Ui::WidgetPicture *ui;
    PictureKind m_kind;
    int m_picture;
    SuperListItem *m_pictureID;
    PrimitiveValue *m_valueID;
    SystemCommonObject *m_object;
    QStandardItemModel *m_parameters;

private slots:
    void on_listWidget_itemDoubleClicked(QListWidgetItem*);
    void on_pushButton_clicked();

signals:
    void pictureChanged(SystemPicture* picture);
};

#endif // WIDGETPICTURE_H
