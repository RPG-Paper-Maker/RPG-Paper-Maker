/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGVIDEOS_H
#define DIALOGVIDEOS_H

#include <QDialog>
#include <QStandardItemModel>

// -------------------------------------------------------
//
//  CLASS DialogVideos
//
//  A dialog used for editing videos in the game.
//
// -------------------------------------------------------

namespace Ui {
class DialogVideos;
}

class DialogVideos : public QDialog
{
    Q_OBJECT

public:
    explicit DialogVideos(QWidget *parent = nullptr);
    ~DialogVideos();

    QStandardItemModel* createFoldersModel() const;

protected:
    virtual void dragEnterEvent(QDragEnterEvent *event);
    virtual void dropEvent(QDropEvent *event);

private:
    Ui::DialogVideos *ui;

    void translate();
};

#endif // DIALOGVIDEOS_H
