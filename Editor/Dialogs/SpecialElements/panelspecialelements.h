/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef PANELSPECIALELEMENTS_H
#define PANELSPECIALELEMENTS_H

#include <QWidget>
#include "systemspritewall.h"
#include "panelsuperlist.h"

// -------------------------------------------------------
//
//  CLASS PanelSpecialElements
//
//  The special elements panel (complete list).
//
// -------------------------------------------------------

namespace Ui {
class PanelSpecialElements;
}

class PanelSpecialElements : public QWidget
{
    Q_OBJECT

public:
    explicit PanelSpecialElements(QWidget *parent = 0);
    ~PanelSpecialElements();
    void initialize(QStandardItemModel* model, PictureKind kind);
    void update(SystemSpecialElement *sys);
    int currentIndex() const;
    PanelSuperList* superList() const;

private:
    Ui::PanelSpecialElements *ui;
    QStandardItemModel* m_model;
    PictureKind m_kind;

private slots:
    void on_pageSelected(QModelIndex index, QModelIndex);
    void on_pictureChanged(SystemPicture* picture);
};

#endif // PANELSPECIALELEMENTS_H
