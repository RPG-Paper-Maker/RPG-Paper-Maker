/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGTILESETSPECIALELEMENTS_H
#define DIALOGTILESETSPECIALELEMENTS_H

#include <QDialog>
#include <QStandardItemModel>
#include "systemtileset.h"

// -------------------------------------------------------
//
//  CLASS DialogTilesetSpecialElements
//
//  A dialog used for setting special elements for a particular tileset.
//
// -------------------------------------------------------

namespace Ui {
class DialogTilesetSpecialElements;
}

class DialogTilesetSpecialElements : public QDialog
{
    Q_OBJECT

public:
    explicit DialogTilesetSpecialElements(SystemTileset* tileset,
                                          PictureKind kind,
                                          QWidget *parent = 0);
    virtual ~DialogTilesetSpecialElements();
    QStandardItemModel* model() const;
    void initialize();
    void move();
    void remove();

private:
    Ui::DialogTilesetSpecialElements *ui;
    SystemTileset* m_tileset;
    PictureKind m_kind;

    void translate();

public slots:
    void on_pushButtonMove_clicked();
    void on_pushButtonDelete_clicked();
    void on_deletingIDs();
    void on_nameChanged(QStandardItem* item);
    virtual void accept();
};

#endif // DIALOGTILESETSPECIALELEMENTS_H
