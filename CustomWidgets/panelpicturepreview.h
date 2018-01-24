/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#ifndef PANELPICTUREPREVIEW_H
#define PANELPICTUREPREVIEW_H

#include <QWidget>
#include <QModelIndex>
#include <QStandardItemModel>
#include "picturekind.h"
#include "superlistitem.h"
#include "systempicture.h"

namespace Ui {
class PanelPicturePreview;
}

class PanelPicturePreview : public QWidget
{
    Q_OBJECT

public:
    explicit PanelPicturePreview(QWidget *parent = 0);
    ~PanelPicturePreview();
    SystemPicture* picture() const;
    void setPicture(SystemPicture* picture);
    int indexX() const;
    void setIndexX(int i);
    int indexY() const;
    void setIndexY(int i);
    void setPictureKind(PictureKind kind);
    void changePicture(SystemPicture* picture);
    void setChooseRect(bool b);

private:
    Ui::PanelPicturePreview *ui;
    PictureKind m_pictureKind;
    SystemPicture* m_picture;

    void showPictures(bool b);
    void updateImage(QStandardItem* item);
    void loadAvailableContent(int row = -1);
    void loadContentFromFolder(QString path, bool isBR);
    void deleteContent(QString path);
    void moveContent();
    void updatePicture();

public slots:
    void showAvailableContent(bool b);

private slots:
    void on_listIDsIndexChanged(QModelIndex index, QModelIndex);
    void on_listIndexChanged(QModelIndex index, QModelIndex);
    void on_pushButtonMove_clicked();
    void on_pushButtonRefresh_clicked();
    void on_pushButtonAdd_clicked();
    void deletingContent(SuperListItem* super, int row);
    void on_treeViewAvailableContentDoubleClicked(QModelIndex);
};

#endif // PANELPICTUREPREVIEW_H
