/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGEMAPPROPERTIES_H
#define DIALOGCOMMANDCHANGEMAPPROPERTIES_H

#include "dialogcommand.h"

namespace Ui {
class DialogCommandChangeMapProperties;
}

class DialogCommandChangeMapProperties : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeMapProperties(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters
        = nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandChangeMapProperties();

    void initializePrimitives();
    void initializeMapsInfos(QStandardItem *item, QString path, int level);
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandChangeMapProperties *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_modelMaps;

public slots:
    void on_checkBoxTilesetID_toggled(bool checked);
    void on_checkBoxMusic_toggled(bool checked);
    void on_checkBoxBackgroundMusic_toggled(bool checked);
    void on_checkBoxCameraPropertiesID_toggled(bool checked);
    void on_checkBoxSky_toggled(bool checked);
    void on_radioButtonColorID_toggled(bool checked);
    void on_radioButtonSkyboxID_toggled(bool checked);
};

#endif // DIALOGCOMMANDCHANGEMAPPROPERTIES_H
