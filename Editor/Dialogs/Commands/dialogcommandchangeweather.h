/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGEWEATHER_H
#define DIALOGCOMMANDCHANGEWEATHER_H

#include <QButtonGroup>
#include "dialogcommand.h"
#include "primitivevalue.h"

namespace Ui {
class DialogCommandChangeWeather;
}

class DialogCommandChangeWeather : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeWeather(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    ~DialogCommandChangeWeather();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandChangeWeather *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    PrimitiveValue *m_imageValueID;
    QButtonGroup *m_buttonGroupMain;
    QButtonGroup *m_buttonGroupTexture;

public slots:
    void on_radioButtonCustom_toggled(bool checked);
    void on_radioButtonColor_toggled(bool checked);
    void on_radioButtonImage_toggled(bool checked);
    void on_pushButtonRain_clicked();
    void on_pushButtonSnow_clicked();
};

#endif // DIALOGCOMMANDCHANGEWEATHER_H
