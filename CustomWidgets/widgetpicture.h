/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef WIDGETPICTURE_H
#define WIDGETPICTURE_H

#include <QWidget>
#include <QListWidget>
#include "systempicture.h"

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
    void openDialog();

private:
    Ui::WidgetPicture *ui;
    PictureKind m_kind;
    int m_picture;
    SuperListItem *m_pictureID;

private slots:
    void on_listWidget_itemDoubleClicked(QListWidgetItem*);
    void on_pushButton_clicked();

signals:
    void pictureChanged(SystemPicture* picture);
};

#endif // WIDGETPICTURE_H
