/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGPICTURES_H
#define DIALOGPICTURES_H

#include <QDialog>
#include <QStandardItemModel>
#include "picturekind.h"

// -------------------------------------------------------
//
//  CLASS DialogPictures
//
//  A dialog used for editing pictures in the game.
//
// -------------------------------------------------------

namespace Ui {
class DialogPictures;
}

class DialogPictures : public QDialog
{
    Q_OBJECT

public:
    explicit DialogPictures(QWidget *parent = 0);
    ~DialogPictures();
    QStandardItemModel* createFoldersModel() const;
    void addfolders(QIcon& icon,
                    QStandardItem* root,
                    QList<QString>& names,
                    QList<PictureKind>& enums) const;

protected:
    virtual void dragEnterEvent(QDragEnterEvent *event);
    virtual void dropEvent(QDropEvent *event);

private:
    Ui::DialogPictures *ui;

    void translate();

private slots:
    void on_folderSelected(const QModelIndex& current, const QModelIndex&);
};

#endif // DIALOGPICTURES_H
