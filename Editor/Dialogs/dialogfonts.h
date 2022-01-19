/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGFONTS_H
#define DIALOGFONTS_H

#include <QDialog>
#include <QStandardItemModel>

// -------------------------------------------------------
//
//  CLASS DialogFonts
//
//  A dialog used for editing fonts in the game.
//
// -------------------------------------------------------

namespace Ui {
class DialogFonts;
}

class DialogFonts : public QDialog
{
    Q_OBJECT

public:
    explicit DialogFonts(QWidget *parent = nullptr);
    ~DialogFonts();

    QStandardItemModel * createFoldersModel() const;

protected:
    virtual void dragEnterEvent(QDragEnterEvent *event);
    virtual void dropEvent(QDropEvent *event);

private:
    Ui::DialogFonts *ui;

    void translate();
};

#endif // DIALOGFONTS_H
