/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELPICTUREPREVIEW_H
#define PANELPICTUREPREVIEW_H

#include <QWidget>
#include <QModelIndex>
#include <QStandardItemModel>
#include "picturekind.h"
#include "superlistitem.h"
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS PanelPicturePreview
//
//  The picture preview panel for selecting a picture with a particular kind.
//
// -------------------------------------------------------

namespace Ui {
class PanelPicturePreview;
}

class PanelPicturePreview : public QWidget
{
    Q_OBJECT

public:
    explicit PanelPicturePreview(QWidget *parent = nullptr);
    ~PanelPicturePreview();

    SystemPicture * picture() const;
    void setPicture(SystemPicture *picture);
    int indexX() const;
    void setIndexX(int i);
    int indexY() const;
    void setIndexY(int i);
    void setIsLimitIndex(bool isLimitIndex);
    void setCurrentTexture(QRect& rect);
    void currentTexture(QRect &rect) const;
    void setPictureKind(PictureKind kind);
    void setAreNegIDsEnabled(bool b);

    void changePicture(SystemPicture *picture);
    void setChooseRect(bool b);
    void dropFiles(QStringList &files);

private:
    Ui::PanelPicturePreview *ui;
    PictureKind m_pictureKind;
    SystemPicture *m_picture;
    bool m_areNegIDsEnabled;

    void showPictures(bool b);
    void updateImage(QStandardItem *item);
    void loadAvailableContent(int row = -1);
    void loadContentFromFolder(QString path, bool isBR, QString dlc = "");
    void deleteContent(QString path);
    void moveContent();
    void updatePicture();
    void showPictureWidget(bool b);
    void translate();

public slots:
    void showAvailableContent(bool b);
    void on_listIDsIndexChanged(QModelIndex index, QModelIndex);
    void on_listIndexChanged(QModelIndex index, QModelIndex);
    void on_pushButtonMove_clicked();
    void on_pushButtonRefresh_clicked();
    void on_pushButtonDelete_clicked();
    void on_pushButtonAdd_clicked();
    void deletingContent(SuperListItem *super, int row);
    void on_treeViewAvailableContentDoubleClicked(QModelIndex);
    void on_pushButtonDLC_clicked();
    void on_pushButtonExport_clicked();
    void on_checkBoxStopAnimation_toggled(bool checked);
};

#endif // PANELPICTUREPREVIEW_H
