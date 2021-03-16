/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELPOSITION_H
#define PANELPOSITION_H

#include <QWidget>
#include "eventcommand.h"

namespace Ui {
class PanelPosition;
}

class PanelPosition : public QWidget
{
    Q_OBJECT

public:
    explicit PanelPosition(QWidget *parent = nullptr);
    ~PanelPosition();

    void getCommand(QVector<QString> &command) const;
    void initializePrimitives(QStandardItemModel *modelObjects,
        QStandardItemModel *properties, QStandardItemModel *parameters);
    void initialize(EventCommand *command, int &i);
    void translate();

private:
    Ui::PanelPosition *ui;

public slots:
   void on_radioButtonSelect_toggled(bool checked);
   void on_radioButtonNumber_toggled(bool checked);
   void on_radioButtonObject_toggled(bool checked);
};

#endif // PANELPOSITION_H
